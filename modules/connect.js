class Connect {
    constructor(width = 7, height = 6, theme = '') {
        if (!localStorage.getItem('player1')) localStorage.setItem('player1', 0);
        if (!localStorage.getItem('player2')) localStorage.setItem('player2', 0);
        this.yellow = `<div class="p2"></div>`;
        this.red = `<div class="p1"></div>`;
        this.prevYellow = `<div class="preview2"></div>`;
        this.prevRed = `<div class="preview1"></div>`;
        this.theme = theme;
        if (Math.random() > 0.5) this.bool = true;
        else this.bool = false;
        this.current = false;
        this.win = false;
        this.yellowX = [];
        this.yellowY = [];
        this.redX = [];
        this.redY = [];
        if (width > 4 && width < 11) this.width = width;
        else this.width = 7;
        if (height > 4 && height < 11) this.height = height;
        else this.height = 7;
        this.last;
        this.undo = false;
        this.createGame();
    }

    //import games
    createGame() {
        let str = '<div class="round"> </div> <div class="all_connect">'
        str += `<div class="game game-${this.theme}">`;
        for(let i=this.width; i>0; i--) {
            str = str + `<div class="column column${i}">`;
            for (let j=1; j<this.height+2; j++) {
                str = str + `<div class="row row${j}"></div>`;
            }
            str = str + '</div>';
        }
        str = str + '</div> <div class="score"> </div> </div> <div class="reset_button"></div>';
        $('#power').html(str);
        $('.reset_button').html('<button id="reset_game">Recommencer</button>');
        $('.score').append('<table> <thead> <th>Joueur 1</th> <th>Joueur 2</th> </thead> <tbody> <td class="score_p1"></td> <td class="score_p2"></td> </tbody> </table> <button id="reset_score">Reset</button>')
        $('.score').append('<div class="message"> </div>');
        $('.score_p1').html(localStorage.getItem('player1'));
        $('.score_p2').html(localStorage.getItem('player2'));
        if (this.bool) $('.round').html('Au tour du joueur 1');
        else $('.round').html('Au tour du joueur 2');
        this.hoverColumn();
    }

    hoverColumn() {
        $('#reset_game').on('click', e => {
            if (confirm('Etes-vous sûr de vouloir recommencer ?')) {
                $('.row').html('');
                $('.row').css('background-color', '');
                $('.message').html('');
                this.bool = true;
                this.current = false;
                this.win = false;
                this.yellowX = [];
                this.yellowY = [];
                this.redX = [];
                this.redY = [];
            }  
        })

        $('#reset_score').on('click', e => {
            if (confirm('Etes-vous sûr de reset le tableau des scores ? Cette action est irréversible.')) {
                localStorage.setItem('player1', 0);
                localStorage.setItem('player2', 0);
                $('.score_p1').html(localStorage.getItem('player1'));
                $('.score_p2').html(localStorage.getItem('player2'));
            }  
        })

        $(document).on('keypress', e => {
            if (e.ctrlKey && e.which == '26' && this.current && !   this.win) {
                $(`.column${this.last[0]} .row${this.last[1]}`).html('');
                this.bool = !this.bool;
            }
        })

        $('.column').on('mouseenter', e => {
            let token = this.prevYellow;
            if (this.bool) token = this.prevRed;
            if (!this.win && !this.current && $('.column' + $(e.target).closest('.column').attr('class').slice(-1) + ' .row2').contents().length == 0) $('.column' + $(e.target).closest('.column').attr('class').slice(-1) + ' .row1').append(token);
            
        })

        $('.column').on('mouseleave', e => {
            $('.column' + $(e.target).closest('.column').attr('class').slice(-1) + ' .row1').html('');
            
        })

        $('.game').on('mouseleave', e => {
            $('.column .row1').html('');  
        })

        $('.column').on('click', e => {
            if (this.current || this.win || $('.column' + $(e.target).closest('.column').attr('class').slice(-1) + ' .row2').contents().length > 0) {
                return false;
            }
            $('.round').html('');
            let str;
            this.current = true;
            let row = $(e.target).closest('.column').attr('class').slice(-1);
            $('.column' + row + ' .row1').html('');
            let token = this.yellow;
            if (this.bool) token = this.red;
            for (let i=this.height+1; i>1; i--) {
                if ($('.column' + row + ' .row' + i).contents().length == 0) {
                    this.bool = !this.bool;
                    $('.column' + row + ' .row' + i).append(token);
                    let result;
                    if (!this.bool) {
                        this.redX.push(i);
                        this.redY.push(parseInt(row))
                        this.last = [row, i];
                        result = new Array(this.redX, this.redY);
                    }
                    else {
                        this.yellowX.push(i);
                        this.yellowY.push(parseInt(row));
                        this.last = [row, i];
                        result = new Array(this.yellowX, this.yellowY);
                    }
                    result = this.victoryCheck(result[0], result[1]);
                    if (result) {
                        this.win = true;
                        switch (result[1]) {
                            case 'h':
                                result[0].forEach(element => {
                                    setTimeout (function() {
                                        $(`.column${element} .row${result[2]} div`).addClass('victory');
                                    }, 2*1000)
                                });
                                str = '<p> Le joueur 2 a gagné ! </p>';
                                if (!this.bool) {
                                    str = '<p> Le joueur 1 a gagné ! </p>'
                                    localStorage.setItem('player1', parseInt(localStorage.getItem('player1')) + 1);
                                } else localStorage.setItem('player2', parseInt(localStorage.getItem('player2')) + 1);
                                setTimeout(function() {
                                        $('.message').append(str);
                                        $('.score_p1').html(localStorage.getItem('player1'));
                                        $('.score_p2').html(localStorage.getItem('player2'));
                                }, 2*1000)
                            return;

                            case 'v':
                                result[0].forEach(element => {
                                    setTimeout (function() {
                                        $(`.column${result[2]} .row${element} div`).addClass('victory');
                                    }, 2*1000)
                                });
                                str = '<p> Le joueur 2 a gagné ! </p>';
                                if (!this.bool) {
                                    str = '<p> Le joueur 1 a gagné ! </p>'
                                    localStorage.setItem('player1', parseInt(localStorage.getItem('player1')) + 1);
                                } else localStorage.setItem('player2', parseInt(localStorage.getItem('player2')) + 1);
                                setTimeout(function() {
                                        $('.message').append(str);
                                        $('.score_p1').html(localStorage.getItem('player1'));
                                        $('.score_p2').html(localStorage.getItem('player2'));
                                }, 2*1000)
                            return;

                            case 'dr':
                                result[0].forEach(element => {
                                    setTimeout (function() {
                                        $(`.column${result[3] - (result[3] - element)} .row${result[2] - (result[3] - element)} div`).addClass('victory');
                                    }, 2*1000)
                                });
                                str = '<p> Le joueur 2 a gagné ! </p>';
                                if (!this.bool) {
                                    str = '<p> Le joueur 1 a gagné ! </p>'
                                    localStorage.setItem('player1', parseInt(localStorage.getItem('player1')) + 1);
                                } else localStorage.setItem('player2', parseInt(localStorage.getItem('player2')) + 1);
                                setTimeout(function() {
                                        $('.message').append(str);
                                        $('.score_p1').html(localStorage.getItem('player1'));
                                        $('.score_p2').html(localStorage.getItem('player2'));
                                }, 2*1000)
                            return;

                            case 'dl':
                                result[0].forEach(element => {
                                    setTimeout (function() {
                                        $(`.column${result[3] + (result[3] - element)} .row${result[2] - (result[3] - element)} div`).addClass('victory');
                                    }, 2*1000)
                                });
                                str = '<p> Le joueur 2 a gagné ! </p>';
                                if (!this.bool) {
                                    str = '<p> Le joueur 1 a gagné ! </p>'
                                    localStorage.setItem('player1', parseInt(localStorage.getItem('player1')) + 1);
                                } else localStorage.setItem('player2', parseInt(localStorage.getItem('player2')) + 1);
                                setTimeout(function() {
                                        $('.message').append(str);
                                        $('.score_p1').html(localStorage.getItem('player1'));
                                        $('.score_p2').html(localStorage.getItem('player2'));
                                }, 2*1000)
                            return;
                        }
                    }
                    if ($('.row2:empty').length == 0) {
                        this.win = true;
                        $('.message').append('<p> Match nul </p>');
                        $('.round').html('');
                    }
                    return setTimeout(() => {
                        this.current = false;
                        if (this.bool) $('.round').html(`Au tour du joueur 1`)
                        else $('.round').html(`Au tour du joueur 2`)
                    }, 2 * 1000)
               } 
            }
        })
    }

    victoryCheck(x, y) {
        let row = x[x.length -1];
        let col = y[y.length -1];
        let h = [col];
        let v = [row];
        let dr = [col];
        let dl = [col];
        let victory;

        for (let i=0; i<x.length; i++) {
            if (x[i] == row) {
                switch (y[i]) {
                    //Horizontal check
                    case col - 3:
                        h.push(y[i]);
                    break;

                    case col - 2:
                        h.push(y[i]);
                    break;

                    case col - 1:
                        h.push(y[i]);
                    break;

                    case col + 1:
                        h.push(y[i]);
                    break;

                    case col + 2:
                        h.push(y[i]);
                    break;

                    case col + 3:
                        h.push(y[i]);
                    break;
                }
            } else if (y[i] == col) {
                switch (x[i]) {
                    //Vertical check
                    case row - 3:
                        v.push(x[i]);
                    break;

                    case row - 2:
                        v.push(x[i]);
                    break;

                    case row - 1:
                        v.push(x[i]);
                    break;

                    case row + 1:
                        v.push(x[i]);
                    break;

                    case row + 2:
                        v.push(x[i]);
                    break;

                    case row + 3:
                        v.push(x[i]);
                    break;
                }
            } else {
                switch(true) {
                    //Diag right check
                    case (row - 3 == x[i] && col - 3 == y[i]):
                        dr.push(parseInt(col - 3));
                    break;
    
                    case (row - 2 == x[i] && col - 2 == y[i]):
                        dr.push(parseInt(col - 2));
                    break;
    
                    case (row - 1 == x[i] && col - 1 == y[i]):
                        dr.push(parseInt(col - 1));
                    break;
    
                    case (row + 1 == x[i] && col + 1 == y[i]):
                        dr.push(parseInt(col + 1));
                    break;
    
                    case (row + 2 == x[i] && col + 2 == y[i]):
                        dr.push(parseInt(col + 2));
                    break;
    
                    case (row + 3 == x[i] && col + 3 == y[i]):
                        dr.push(parseInt(col + 3));
                    break;
    
                    //Diag left check
                    case (row - 3 == x[i] && col + 3 == y[i]):
                        dl.push(parseInt(col - 3));
                    break;
    
                    case (row - 2 == x[i] && col + 2 == y[i]):
                        dl.push(parseInt(col - 2));
                    break;
    
                    case (row - 1 == x[i] && col + 1 == y[i]):
                        dl.push(parseInt(col - 1));
                    break;
    
                    case (row + 1 == x[i] && col - 1 == y[i]):
                        dl.push(parseInt(col + 1));
                    break;
    
                    case (row + 2 == x[i] && col - 2 == y[i]):
                        dl.push(parseInt(col + 2));
                    break;
    
                    case (row + 3 == x[i] && col - 3 == y[i]):
                        dl.push(parseInt(col + 3));
                    break;
                }
            }
        }
        h.sort((a,b) => a - b);
        v.sort((a,b) => a - b);
        dr.sort((a,b) => a - b);
        dl.sort((a,b) => a - b);
        let group = [h, v, dr, dl];
        for (let i=0; i<group.length; i++) {
            victory = [group[i][0]];
            for (let j=1; j<group[i].length; j++) {
                if (group[i][j] == group[i][j-1] + 1) victory.push(group[i][j]);
                if (victory.length == 4) {
                    switch(i) {
                        case 0:
                            return new Array(victory, 'h', row);

                        case 1:
                            return new Array(victory, 'v', col);

                        case 2:
                            return new Array(victory, 'dr', row, col);

                        case 3:
                            return new Array(victory, 'dl', row, col);
                    }
                }
            }
        }
        return false;
    }
}

export { Connect };