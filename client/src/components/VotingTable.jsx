/* eslint-disable react/prop-types */
const VotingTable = ({ playerChoices }) => {
    const tableContainer = {
        border: '1px solid white', 
        borderRadius: '10px', 
        padding: '10px', 
    };

    const table ={
        borderCollapse: 'collapse',
        width: '100%',
    };

    const columnHeaderStyle = {
        border: '2px solid black',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '20px',
        paddingBottom: '20px',
        textAlign: 'center',
    };

    const rowHeader = ['rgb(33, 33, 33,0.9)']; 

    const boldText = {
        fontWeight: 'bold',
    };


    const columnInputs = {
        textAlign: 'center',
        color: 'black',
        borderRadius: '8px',
    }

    const separatorStyleRight = {
        borderRight: '2px solid black',
    };

    const separatorStyleBottom = {
        borderBottom: '2px solid black'
    }


    const rowColors = [
        'rgba(255, 253, 130, 0.9',
        'rgba(255, 155, 113, 0.9)',
        'rgba(27, 153, 139, 0.9)',
        'rgba(232, 72, 85, 0.9)',    
    ]; 

    return (
        <h1 className='text-xl'>
            {playerChoices ? (
                <div className='border rounded-lg padding 10px' style={tableContainer}>
                    <table style={table}>
                        <thead>
                            <tr style={{ backgroundColor: rowHeader}}>
                                <th style={{ ...columnHeaderStyle, ...separatorStyleRight }}>Player</th>
                                <th style={columnHeaderStyle}>Choices</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerChoices.map((choice,index) => (
                                <tr key={choice.chooser.id} style={{ backgroundColor: rowColors[index % rowColors.length] }}>
                                <td style={{...columnInputs,...separatorStyleRight,...separatorStyleBottom,...boldText }}>{choice.chooser.name}</td>
                                <td style={{...columnInputs,...separatorStyleBottom}}>{choice.chosen.name}</td>
                            </tr>
                    ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Error</p>
            )}
        </h1>
    );
};

export default VotingTable;
